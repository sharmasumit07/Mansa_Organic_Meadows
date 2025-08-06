/**
 * scripts/upload-to-cloudinary.mjs
 * - Safe uploader using dotenv and a local cache (cloudinary-urls.json)
 * - Usage: node scripts/upload-to-cloudinary.mjs
 *
 * Requirements:
 *   npm i cloudinary dotenv
 *   Create .env.local with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   Add .env.local to .gitignore
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// --- CONFIG (read from env, no hardcoded secrets) ---
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('ERROR: Cloudinary credentials are missing. Put them in .env.local or environment variables:');
  console.error('  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}

const TARGET_FOLDER = 'mansa_photos';
const LOCAL_FOLDER = path.join(process.cwd(), 'public', 'Mansa photos'); // adjust if you renamed

// configure cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const resourceAsync = util.promisify(cloudinary.api.resource).bind(cloudinary.api);
const uploadAsync = util.promisify(cloudinary.uploader.upload).bind(cloudinary.uploader);

// load or initialize cache file
const OUT_JSON = path.join(process.cwd(), 'cloudinary-urls.json');
let cache = [];
try {
  if (fs.existsSync(OUT_JSON)) {
    const raw = fs.readFileSync(OUT_JSON, 'utf8');
    cache = JSON.parse(raw);
    if (!Array.isArray(cache)) cache = [];
  } else {
    cache = [];
  }
} catch (err) {
  console.warn('Warning: could not read cloudinary-urls.json, starting fresh.', err.message || err);
  cache = [];
}

// helper: check cache for local relative file
function findInCache(relPath) {
  return cache.find((c) => c.file === relPath);
}

// gather local files recursively
if (!fs.existsSync(LOCAL_FOLDER)) {
  console.error('Local folder not found:', LOCAL_FOLDER);
  process.exit(1);
}
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else if (e.isFile()) out.push(full);
  }
  return out;
}
const allFiles = walk(LOCAL_FOLDER);
console.log(`Found ${allFiles.length} files in ${LOCAL_FOLDER}`);

// candidate public_id variants to check (avoid re-upload)
function candidatesFor(baseNameNoExt) {
  return [
    `${TARGET_FOLDER}/${baseNameNoExt}`,
    `${baseNameNoExt}`,
    `Mansa photos/${baseNameNoExt}`,
    `mansa_photos/${baseNameNoExt}`,
  ];
}

async function checkResource(publicIdCandidate) {
  try {
    const resImage = await resourceAsync(publicIdCandidate, { resource_type: 'image' });
    if (resImage && resImage.secure_url) return { resource_type: 'image', data: resImage };
  } catch (e) {}
  try {
    const resVideo = await resourceAsync(publicIdCandidate, { resource_type: 'video' });
    if (resVideo && resVideo.secure_url) return { resource_type: 'video', data: resVideo };
  } catch (e) {}
  return null;
}

async function processFile(fileFullPath) {
  const rel = path.relative(LOCAL_FOLDER, fileFullPath).replace(/\\/g, '/'); // normalize windows paths
  // if cached, return it
  const cached = findInCache(rel);
  if (cached) {
    console.log(`↩ Using cached entry for ${rel}`);
    return cached;
  }

  const ext = path.extname(fileFullPath).toLowerCase();
  const base = path.basename(fileFullPath, ext);

  // 1) check common public_id candidates
  for (const cand of candidatesFor(base)) {
    try {
      const found = await checkResource(cand);
      if (found) {
        const entry = {
          file: rel,
          public_id: cand,
          resource_type: found.resource_type,
          url: found.data.secure_url,
          from: 'cloudinary-existing',
        };
        cache.push(entry);
        // save intermediate cache so we don't lose progress
        fs.writeFileSync(OUT_JSON, JSON.stringify(cache, null, 2));
        console.log(`↩ Found on Cloudinary: ${rel} -> ${cand}`);
        return entry;
      }
    } catch (err) {
      // ignore and continue
    }
  }

  // 2) not found -> upload
  console.log(`🔼 Uploading ${rel} -> folder ${TARGET_FOLDER} ...`);
  try {
    const res = await uploadAsync(fileFullPath, {
      resource_type: 'auto',
      use_filename: true,
      unique_filename: false,
      folder: TARGET_FOLDER,
    });

    const entry = {
      file: rel,
      public_id: res.public_id,
      resource_type: res.resource_type,
      url: res.secure_url,
      from: 'uploaded',
    };
    cache.push(entry);
    fs.writeFileSync(OUT_JSON, JSON.stringify(cache, null, 2));
    console.log(`✅ Uploaded: ${rel} -> ${res.public_id}`);
    return entry;
  } catch (err) {
    console.error(`❌ Upload failed for ${rel}:`, err.message || err);
    const entry = { file: rel, error: err.message || String(err) };
    cache.push(entry);
    fs.writeFileSync(OUT_JSON, JSON.stringify(cache, null, 2));
    return entry;
  }
}

(async () => {
  for (const f of allFiles) {
    const baseName = path.basename(f);
    if (baseName.startsWith('.')) continue;
    // process sequentially to avoid rate/connection issues
    // eslint-disable-next-line no-await-in-loop
    await processFile(f);
  }

  console.log(`\n🎉 Done. Wrote ${cache.length} entries to ${OUT_JSON}`);
})();
