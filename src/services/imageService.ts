import fs from 'fs';
import path from 'path';

import { createCanvas } from 'canvas';
import dayjs from 'dayjs';

import { Country } from '@prisma/client';
import { CACHE_DIR } from '../config/path';

export async function generateSummaryImage(
  totalCountries: number,
  lastRefreshedAt: Date,
  topCountries: Country[]
) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Background
  context.fillStyle = '#f0f0f0';
  context.fillRect(0, 0, width, height);

  // Title
  context.fillStyle = '#333';
  context.font = 'bold 30px Sans';
  context.fillText('Country Data Summary', 50, 60);

  // Stats
  context.font = '20px Sans';
  context.fillText(`Total Countries: ${totalCountries}`, 50, 120);
  context.fillText(
    `Last Refresh: ${dayjs(lastRefreshedAt).format('YYYY-MM-DD HH:mm:ss')} UTC`,
    50,
    150
  );

  // Top 5
  context.font = 'bold 22px Sans';
  context.fillText('Top 5 Countries by Estimated GDP (USD)', 50, 220);
  context.font = '18px Sans';
  let yPos = 260;
  topCountries.forEach((country, index) => {
    const gdp = country.estimated_gdp
      ? Number(country.estimated_gdp).toLocaleString('en-US', {
          maximumFractionDigits: 0,
        })
      : 'N/A';
    context.fillText(`${index + 1}. ${country.name}: $${gdp}`, 50, yPos);
    yPos += 30;
  });

  // Ensure cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }

  // Save image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(CACHE_DIR, 'summary.png'), buffer);
}
