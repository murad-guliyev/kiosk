import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';

const DIR = 'public/assets/money';
const WEBP_QUALITY = 80;

async function main() {
  const files = await readdir(DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;
  const renames = []; // { oldPath, newPath, oldName, newName }

  for (const file of files) {
    const ext = file.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) continue;

    const oldPath = join(DIR, file);
    const newName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const newPath = join(DIR, newName);

    const before = (await stat(oldPath)).size;
    await sharp(oldPath).webp({ quality: WEBP_QUALITY }).toFile(newPath);
    const after = (await stat(newPath)).size;

    await unlink(oldPath);

    totalBefore += before;
    totalAfter += after;
    count++;
    renames.push({ oldName: file, newName });

    if (count <= 5 || before > 500000) {
      const bKB = (before / 1024).toFixed(0);
      const aKB = (after / 1024).toFixed(0);
      console.log(`  ${file} → ${newName}: ${bKB}KB → ${aKB}KB`);
    }
  }

  console.log(`\nConverted: ${count} images`);
  console.log(`Total: ${(totalBefore / 1048576).toFixed(1)}MB → ${(totalAfter / 1048576).toFixed(1)}MB (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);

  // Output rename map for JSON update
  console.log('\nJSON_RENAMES_START');
  for (const r of renames) {
    console.log(`${r.oldName}|${r.newName}`);
  }
  console.log('JSON_RENAMES_END');
}

main().catch(console.error);
