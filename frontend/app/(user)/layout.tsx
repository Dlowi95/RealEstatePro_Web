import NavigationBar from "@/components/ui/user/navigation-bar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
        <NavigationBar />

        <main className="container mx-auto mt-6 px-4">
            {children}
        </main>
    </div>
  )
}
