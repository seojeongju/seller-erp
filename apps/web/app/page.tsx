"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, Zap, Shield, Smartphone, Search, Mail } from "lucide-react";
// Deployment trigger

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Animated Orbits Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Inner Orbit - 2 Icons */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute h-[280px] w-[280px] rounded-full border border-indigo-200/60 md:h-[350px] md:w-[350px]"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-sm md:p-3">
            <Globe className="h-4 w-4 text-indigo-500 md:h-6 md:w-6" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-white p-2 shadow-sm md:p-3">
            <Zap className="h-4 w-4 text-amber-500 md:h-6 md:w-6" />
          </div>
        </motion.div>

        {/* Middle Orbit - 2 Icons */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute h-[440px] w-[440px] rounded-full border border-indigo-200/50 md:h-[550px] md:w-[550px]"
        >
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-sm md:p-4">
            <Shield className="h-4 w-4 text-emerald-500 md:h-6 md:w-6" />
          </div>
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-sm md:p-4">
            <Smartphone className="h-4 w-4 text-blue-500 md:h-6 md:w-6" />
          </div>
        </motion.div>

        {/* Outer Orbit - 2 Icons */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute h-[600px] w-[600px] rounded-full border border-indigo-200/40 md:h-[750px] md:w-[750px]"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-sm md:p-3">
            <Search className="h-4 w-4 text-purple-500 md:h-6 md:w-6" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-white p-2 shadow-sm md:p-3">
            <Mail className="h-4 w-4 text-rose-500 md:h-6 md:w-6" />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-6 p-4 text-center md:space-y-8 md:p-8">
        <div>
          {/* Logo */}
          <div className="mb-2 flex justify-center md:mb-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-60 w-60 md:h-96 md:w-96"
            >
              <Image
                src="/Logo.png"
                alt="WOW Seller ERP"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </motion.div>
          </div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 md:text-5xl"
          >
            WOW Seller ERP
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-base text-gray-600 md:mt-4 md:text-xl"
          >
            빛나는 가치를 더 완벽하게 관리하는 법
          </motion.p>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-600 md:text-xl"
          >
            현대적인 멀티테넌시(Multi-tenancy) SaaS ERP 시스템
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:gap-4"
        >
          <Link
            href="/auth/signin?tenant=test-company"
            className="w-full max-w-xs rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 sm:w-auto md:px-8 md:py-4 md:text-lg"
          >
            로그인
          </Link>
          <Link
            href="/dashboard?tenant=test-company"
            className="w-full max-w-xs rounded-lg border-2 border-indigo-600 bg-white px-6 py-3 text-base font-semibold text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-300 sm:w-auto md:px-8 md:py-4 md:text-lg"
          >
            대시보드 보기
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-2 md:gap-4 md:pt-8 lg:grid-cols-4">
            <div className="rounded-lg bg-white/80 p-3 shadow-md backdrop-blur-sm transition-transform hover:-translate-y-1 hover:shadow-lg md:p-4">
              <div className="mb-2 text-2xl md:mb-3 md:text-3xl">📦</div>
              <h3 className="text-sm font-bold text-gray-900 md:text-base">재고 관리</h3>
              <p className="mt-1 text-xs text-gray-600 md:mt-1.5 md:text-sm">
                실시간 재고 추적
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-3 shadow-md backdrop-blur-sm transition-transform hover:-translate-y-1 hover:shadow-lg md:p-4">
              <div className="mb-2 text-2xl md:mb-3 md:text-3xl">🏷️</div>
              <h3 className="text-sm font-bold text-gray-900 md:text-base">상품 관리</h3>
              <p className="mt-1 text-xs text-gray-600 md:mt-1.5 md:text-sm">
                상품 및 옵션 관리
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-3 shadow-md backdrop-blur-sm transition-transform hover:-translate-y-1 hover:shadow-lg md:p-4">
              <div className="mb-2 text-2xl md:mb-3 md:text-3xl">📊</div>
              <h3 className="text-sm font-bold text-gray-900 md:text-base">판매 분석</h3>
              <p className="mt-1 text-xs text-gray-600 md:mt-1.5 md:text-sm">
                매출 트렌드 분석
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-3 shadow-md backdrop-blur-sm transition-transform hover:-translate-y-1 hover:shadow-lg md:p-4">
              <div className="mb-2 text-2xl md:mb-3 md:text-3xl">👥</div>
              <h3 className="text-sm font-bold text-gray-900 md:text-base">고객 관리</h3>
              <p className="mt-1 text-xs text-gray-600 md:mt-1.5 md:text-sm">
                고객 정보 통합
              </p>
            </div>
          </div>
        </motion.div>

        <div className="pt-2 md:pt-4">
          <p className="text-xs text-gray-500 md:text-sm">
            테스트 계정: admin@test.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
