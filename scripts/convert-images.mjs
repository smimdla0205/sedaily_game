import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const images = [
  'public/backgrounds/g1-swan-water.png',
  'public/backgrounds/g2-silhouettes-clean.png',
  'public/backgrounds/g3-signal-waves.png',
  'public/bg/texture.png',
  'public/games/hero-main.png',
];

let totalBefore = 0;
let totalAfter = 0;

async function convertToWebP(inputPath) {
  try {
    const outputPath = inputPath.replace('.png', '.webp');
    
    const beforeSize = fs.statSync(inputPath).size;
    
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    const afterSize = fs.statSync(outputPath).size;
    const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   ${(beforeSize / 1024 / 1024).toFixed(2)}MB → ${(afterSize / 1024 / 1024).toFixed(2)}MB (${reduction}% 감소)`);
    
    totalBefore += beforeSize;
    totalAfter += afterSize;
  } catch (error) {
    console.error(`❌ ${inputPath}: ${error.message}`);
  }
}

async function main() {
  console.log('🖼️  PNG를 WebP로 변환 중...\n');
  
  for (const image of images) {
    if (fs.existsSync(image)) {
      await convertToWebP(image);
    }
  }
  
  if (totalBefore > 0) {
    const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
    console.log(`\n📊 총 크기 변화`);
    console.log(`   ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB (${totalReduction}% 감소)`);
  }
}

main();
