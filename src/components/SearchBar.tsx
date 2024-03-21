"use client";

import { Loader2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

const SearchBar = () => {
  // get the searchParams in a client side component and use them to set the default query
  // in a server component you can just use the searchParams prop
  const searchParams = useSearchParams();
  const defaultQuery = searchParams.get("query") || "";

  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();
  const router = useRouter();
  const [query, setQuery] = useState<string>(defaultQuery);

  const search = () => {
    startTransition(() => {
      router.push(`/search?query=${query}`);
    });
  };

  // this is how to listen to pathname changes in next 14 and rerender the component
  useEffect(() => {
    if (pathname === "/") {
      setQuery("");
    }
  }, [pathname]);

  return (
    <div className="relative w-full h-14 flex flex-col bg-white">
      <div className="relative w-full h-14 z-10 rounded-md">
        <Input
          disabled={isSearching}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }

            if (e.key === "Escape") {
              inputRef?.current?.blur();
            }
          }}
          ref={inputRef}
          className="absolute inset-0 h-full"
        />
        <Button
          disabled={isSearching}
          className="absolute right-0 inset-y-0 h-full rounded-l-none"
          onClick={search}
        >
          {isSearching ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Search className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};
export default SearchBar;
