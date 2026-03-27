import { Outlet } from "react-router";

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-linear-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* <aside className="w-64 border-r border-default-200 bg-white/50 hidden md:block">
        <span>сайдбар</span>
      </aside> */}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
