import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RenderMode } from "@/domains/canvas/hooks/useWsCanvasData";

export function useModeParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modeParam = searchParams.get("mode");
  const mode: RenderMode = modeParam === "state" ? "state" : "ref";

  const toggleMode = () => {
    const nextMode = mode === "ref" ? "state" : "ref";
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", nextMode);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return { mode, toggleMode };
}
