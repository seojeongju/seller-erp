import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성 시작...');

  // 1. 테넌트 생성
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'test-company' },
    update: {},
    create: {
      name: '테스트 회사',
      slug: 'test-company',
      subdomain: 'test-company.myerp.com',
      primaryColor: '#3B82F6',
    },
  });

  console.log('✅ 테넌트 생성:', tenant.name);

  // 2. 관리자 사용자 생성
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@test.com',
      },
    },
    update: {},
    create: {
      email: 'admin@test.com',
      name: '관리자',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  console.log('✅ 관리자 사용자 생성:', admin.email);

  // 3. 일반 사용자 생성
  const member = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'member@test.com',
      },
    },
    update: {},
    create: {
      email: 'member@test.com',
      name: '일반 사용자',
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: tenant.id,
    },
  });

  console.log('✅ 일반 사용자 생성:', member.email);

  // 4. 테스트 고객 생성
  const customer = await prisma.customer.create({
    data: {
      name: '테스트 고객',
      email: 'customer@test.com',
      phone: '010-1234-5678',
      company: '테스트 고객사',
      tenantId: tenant.id,
    },
  });

  console.log('✅ 테스트 고객 생성:', customer.name);

  // 5. 테스트 상품 생성
  const product = await prisma.product.create({
    data: {
      name: '테스트 상품',
      sku: 'TEST-001',
      description: '테스트용 상품입니다',
      category: '테스트 카테고리',
      brand: '테스트 브랜드',
      tenantId: tenant.id,
      variants: {
        create: [
          {
            name: '기본 옵션',
            sku: 'TEST-001-BASE',
            price: 100000,
            cost: 50000,
            quantity: 10,
            trackSerialNumbers: false,
            tenantId: tenant.id,
          },
          {
            name: '프리미엄 옵션',
            sku: 'TEST-001-PREMIUM',
            price: 200000,
            cost: 100000,
            quantity: 5,
            trackSerialNumbers: true,
            tenantId: tenant.id,
          },
        ],
      },
    },
  });

  console.log('✅ 테스트 상품 생성:', product.name);

  console.log('\n🎉 시드 데이터 생성 완료!');
  console.log('\n📝 테스트 계정 정보:');
  console.log('   테넌트 슬러그: test-company');
  console.log('   관리자 이메일: admin@test.com');
  console.log('   비밀번호: admin123');
  console.log('   일반 사용자: member@test.com');
  console.log('   비밀번호: admin123');
  console.log('\n🌐 접속 URL:');
  console.log('   http://localhost:3000?tenant=test-company');
  console.log('   http://localhost:3000/auth/signin?tenant=test-company');
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

