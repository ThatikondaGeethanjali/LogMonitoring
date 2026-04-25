import { Dashboard, SideBar } from "@/features/log-monitoring"

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="w-[30%]">
        <SideBar />
      </div>
      <Dashboard />
    </div>
  )
}
