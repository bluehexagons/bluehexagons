import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ASSETS_DIR = path.join(process.cwd(), 'public/assets');
const THUMBS_DIR = path.join(ASSETS_DIR, 'thumbs');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

async function findImages(directory: string): Promise<string[]> {
    const images: string[] = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'thumbs' || entry.name === 'icons') continue;
            images.push(...await findImages(fullPath));
            continue;
        }
        if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
            images.push(path.relative(ASSETS_DIR, fullPath));
        }
    }
    return images;
}

async function generateThumbs() {
    await mkdir(THUMBS_DIR, { recursive: true });
    const images = await findImages(ASSETS_DIR);
    console.log(`Found ${images.length} images to check.`);

    let generatedCount = 0;
    const failures: string[] = [];

    for (const imagePath of images) {
        const fullSourcePath = path.join(ASSETS_DIR, imagePath);
        const fullDestPath = path.join(THUMBS_DIR, imagePath);
        const destDir = path.dirname(fullDestPath);

        await mkdir(destDir, { recursive: true });

        let needsThumbnail = true;
        try {
            const [sourceInfo, destInfo] = await Promise.all([stat(fullSourcePath), stat(fullDestPath)]);
            needsThumbnail = sourceInfo.mtimeMs > destInfo.mtimeMs;
        } catch {
            // A missing thumbnail is generated below; Sharp reports any other
            // input problem with the source path.
        }

        if (needsThumbnail) {
            console.log(`Generating thumbnail for: ${imagePath}`);
            try {
                await sharp(fullSourcePath)
                    .resize(300, null, { withoutEnlargement: true }) // Width 300px, maintain aspect ratio, don't enlarge small images
                    .toFile(fullDestPath);
                generatedCount++;
            } catch (err) {
                console.error(`Error generating thumbnail for ${imagePath}:`, err);
                failures.push(imagePath);
            }
        }
    }
    console.log(`Thumbnail generation complete. Generated ${generatedCount} new thumbnails.`);
    if (failures.length > 0) {
        throw new Error(`Could not generate ${failures.length} thumbnail(s).`);
    }
}

await generateThumbs();
