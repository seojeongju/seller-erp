"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  paramName?: string;
  placeholder?: string;
  defaultValue?: string;
}

export function FilterSelect({
  options,
  paramName = "filter",
  placeholder = "필터 선택",
  defaultValue = "",
}: FilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // 페이지를 1로 리셋
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (value: string) => {
    const query = createQueryString(paramName, value);
    router.push(`${pathname}?${query}`);
  };

  const currentValue = searchParams.get(paramName) || defaultValue;

  return (
    <select
      value={currentValue}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

