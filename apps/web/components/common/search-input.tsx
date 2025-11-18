"use client";

import { Search } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "검색...",
  paramName = "search",
  debounceMs = 300,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get(paramName) || ""
  );
  const debouncedSearch = useDebounce(searchValue, debounceMs);

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

  useEffect(() => {
    const query = createQueryString(paramName, debouncedSearch);
    router.push(`${pathname}?${query}`);
  }, [debouncedSearch, paramName, pathname, router, createQueryString]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

