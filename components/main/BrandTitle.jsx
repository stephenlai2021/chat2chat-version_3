import { useRouter } from "next/navigation";

export default function BrandTitle() {
  const router = useRouter();

  return (
    <div className="flex-1">
      <div className="text-xl font-bold text-base-content pl-3">
        <h1
          className="font-secondary text-xl text-center font-semibold text-base-content hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          CHAT<span className="font-bold text-[#eeab63ff]">2</span>CHAT
        </h1>
      </div>
    </div>
  );
}
