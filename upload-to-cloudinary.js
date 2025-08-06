/**
 * Upload-to-Cloudinary (safe)
 * - Checks if an asset already exists on Cloudinary (tries several candidate public_ids)
 * - If exists, retrieves its secure_url and resource_type
 * - If not, uploads the local file to folder `mansa_photos` with use_filename=true & unique_filename=false
 * - Produces cloudinary-urls.json with { file, public_id, resource_type, url }
 *
 * Usage:
 *   node scripts/upload-to-cloudinary.mjs
 *
 * Requirements:
 *   npm install cloudinary
 *   Set environment variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *   Or edit the cloudinary.config section below.
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import util from 'util';

// --- CONFIG (prefer env vars) ---
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dlstdyi8d';
const API_KEY = process.env.CLOUDINARY_API_KEY || '953531345277726';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'KZX1CM7HsNGrZ8bYBwJnH7lxgnU';

// folder in Cloudinary where you'll store assets
const TARGET_FOLDER = 'mansa_photos';

// local folder with files
const LOCAL_FOLDER = path.join(process.cwd(), 'public', 'Mansa photos'); // change if renamed

// --- Cloudinary config ---
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// promisified helpers
const resourceAsync = util.promisify(cloudinary.api.resource).bind(cloudinary.api);
const uploadAsync = util.promisify(cloudinary.uploader.upload).bind(cloudinary.uploader);

// read local files
if (!fs.existsSync(LOCAL_FOLDER)) {
  console.error('Local folder not found:', LOCAL_FOLDER);
  process.exit(1);
}

const allFiles = (function gather() {
  // read files recursively (skip directories)
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        files = files.concat(walk(full));
      } else if (e.isFile()) {
        files.push(full);
      }
    }
    return files;
  }
  return walk(LOCAL_FOLDER);
})();

console.log(`Found ${allFiles.length} files in ${LOCAL_FOLDER}`);

const results = [];

async function findExistingPublicIdCandidates(basenameNoExt) {
  // try a few candidate public_ids in order:
  // 1) folder/basename (recommended if we upload to folder)
  // 2) basename (if uploaded at root previously)
  // 3) original path with spaces replaced as in "Mansa photos/basename"
  const candidates = [
    `${TARGET_FOLDER}/${basenameNoExt}`,
    `${basenameNoExt}`,
    `Mansa photos/${basenameNoExt}`,
    `Mansa_photos/${basenameNoExt}`,
  ];
  return candidates;
}

async function checkResource(publicIdCandidate) {
  // Try as image first, then video
  try {
    const res = await resourceAsync(publicIdCandidate, { resource_type: 'image' });
    if (res && res.secure_url) return { resource_type: 'image', data: res };
  } catch (e) {
    // ignore not found
  }
  try {
    const resv = await resourceAsync(publicIdCandidate, { resource_type: 'video' });
    if (resv && resv.secure_url) return { resource_type: 'video', data: resv };
  } catch (e) {
    // ignore not found
  }
  return null;
}

async function processFile(filePath) {
  const rel = path.relative(LOCAL_FOLDER, filePath); // subpath relative to folder
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const safeBase = base; // keep as-is (we will upload with use_filename true)
  const candidates = await findExistingPublicIdCandidates(safeBase);

  // 1) check existing on Cloudinary
  for (const candidate of candidates) {
    try {
      const found = await checkResource(candidate);
      if (found) {
        const public_id = candidate;
        const url = found.data.secure_url;
        console.log(`↩ Found existing: ${rel} -> ${public_id} (${found.resource_type})`);
        return { file: rel, public_id, resource_type: found.resource_type, url };
      }
    } catch (err) {
      // ignore and continue
    }
  }

  // 2) not found -> upload
  console.log(`🔼 Uploading: ${rel} -> folder ${TARGET_FOLDER}`);
  try {
    // when uploading, set public_id in TARGET_FOLDER and keep filename (no uniq)
    const uploadOptions = {
      resource_type: 'auto',
      use_filename: true,
      unique_filename: false,
      folder: TARGET_FOLDER,
      // you may set eager/transformation options here if needed
    };

    const res = await uploadAsync(filePath, uploadOptions);
    // res.resource_type provides type, res.secure_url has URL
    console.log(`✅ Uploaded ${rel} -> ${res.public_id} (${res.resource_type})`);
    return {
      file: rel,
      public_id: res.public_id,
      resource_type: res.resource_type,
      url: res.secure_url,
    };
  } catch (err) {
    console.error(`❌ Upload failed for ${rel}:`, err.message || err);
    return { file: rel, error: err.message || String(err) };
  }
}

(async () => {
  for (const f of allFiles) {
    // skip dotfiles / system files
    const name = path.basename(f);
    if (name.startsWith('.')) continue;

    const result = await processFile(f);
    results.push(result);
  }

  // write results to JSON
  const outPath = path.join(process.cwd(), 'cloudinary-urls.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n🎉 Done. Wrote ${results.length} entries to ${outPath}`);
})();
