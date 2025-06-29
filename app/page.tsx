import Clock1 from "@/components/Clock1";
import Clock2 from "@/components/Clock2";

export default function Home() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Half - Clock 1 */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <Clock1 />
      </div>

      {/* Right Half - Clock 2 with vertical divider */}
      <div className="w-1/2 flex items-center justify-center p-8 border-l-[5px] border-gray-300">
        <Clock2 />
      </div>
    </div>
  );
}
