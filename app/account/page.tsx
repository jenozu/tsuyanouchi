import { auth } from "@/auth"
import { redirect } from "next/navigation"
import NavbarWrapper from "@/components/navbar-wrapper"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AccountPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <main className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">My Account</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback className="text-2xl">{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-medium">{session.user?.name}</p>
              <p className="text-muted-foreground">{session.user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </main>
  )
}

