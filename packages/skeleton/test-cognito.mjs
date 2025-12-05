#!/usr/bin/env node
/**
 * Test script to verify Cognito Identity Pool and S3 access
 */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

// Load from .env manually (no dotenv in ESM)
import { readFileSync } from 'fs';
const envContent = readFileSync('../../.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const REGION = env.VITE_AWS_REGION || 'us-east-1';
const IDENTITY_POOL_ID = env.VITE_AWS_COGNITO_IDENTITY_POOL_ID;
const BUCKET = env.VITE_AWS_S3_BUCKET;

console.log('Testing Cognito + S3 Configuration');
console.log('===================================');
console.log(`Region: ${REGION}`);
console.log(`Identity Pool ID: ${IDENTITY_POOL_ID}`);
console.log(`S3 Bucket: ${BUCKET}`);
console.log('');

if (!IDENTITY_POOL_ID || IDENTITY_POOL_ID.includes('xxxxxxxx')) {
  console.error('❌ VITE_AWS_COGNITO_IDENTITY_POOL_ID not configured in .env');
  process.exit(1);
}

if (!BUCKET || BUCKET.includes('your-bucket')) {
  console.error('❌ VITE_AWS_S3_BUCKET not configured in .env');
  process.exit(1);
}

// Check Identity Pool ID format
const idMatch = IDENTITY_POOL_ID.match(/^([\w-]+):([a-f0-9-]{36})$/);
if (!idMatch) {
  console.error('❌ Identity Pool ID format looks wrong.');
  console.error('   Expected format: us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  console.error(`   Got: ${IDENTITY_POOL_ID}`);
  console.log('');
  console.log('💡 Tip: The Identity Pool ID should be just region:uuid');
  console.log('   Example: us-east-1:8988c26a-2063-4e34-9ef3-c65c9aa7103f');
  process.exit(1);
}

try {
  console.log('1. Getting credentials from Cognito...');
  
  const s3Client = new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      identityPoolId: IDENTITY_POOL_ID,
      clientConfig: { region: REGION },
    }),
  });

  console.log('   ✅ Cognito credentials obtained');

  // Test write
  const testKey = `scenes/test-${Date.now()}.json`;
  const testData = JSON.stringify({ test: true, timestamp: new Date().toISOString() });

  console.log(`2. Testing S3 PutObject to ${testKey}...`);
  
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: testKey,
    Body: testData,
    ContentType: 'application/json',
  }));
  
  console.log('   ✅ S3 PutObject succeeded');

  // Test read
  console.log(`3. Testing S3 GetObject from ${testKey}...`);
  
  const getResult = await s3Client.send(new GetObjectCommand({
    Bucket: BUCKET,
    Key: testKey,
  }));
  
  const body = await getResult.Body.transformToString();
  console.log('   ✅ S3 GetObject succeeded');
  console.log(`   Data: ${body}`);

  // Cleanup
  console.log(`4. Cleaning up test file...`);
  
  await s3Client.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: testKey,
  }));
  
  console.log('   ✅ Test file deleted');

  console.log('');
  console.log('🎉 All tests passed! Cognito + S3 is configured correctly.');

} catch (error) {
  console.error('');
  console.error('❌ Error:', error.message);
  console.error('');
  
  if (error.name === 'NotAuthorizedException') {
    console.log('💡 The Identity Pool may not allow unauthenticated access.');
    console.log('   Check: Cognito → Identity Pools → Your Pool → Edit → Enable unauthenticated access');
  } else if (error.name === 'AccessDenied' || error.message.includes('Access Denied')) {
    console.log('💡 S3 access denied. Check the IAM role attached to the Cognito Identity Pool.');
    console.log('   The role needs s3:PutObject and s3:GetObject on your bucket/scenes/*');
  } else if (error.name === 'ResourceNotFoundException') {
    console.log('💡 Identity Pool not found. Double-check the VITE_AWS_COGNITO_IDENTITY_POOL_ID.');
  } else if (error.message.includes('CORS')) {
    console.log('💡 CORS error. Add CORS configuration to your S3 bucket.');
  }
  
  process.exit(1);
}
