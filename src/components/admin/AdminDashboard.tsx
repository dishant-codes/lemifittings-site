import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsManager } from "./ProductsManager";
import { OffersManager } from "./OffersManager";
import { CategoriesManager } from "./CategoriesManager";
import { BlogsManager } from "./BlogsManager";
import { ImageStorageStats } from "./ImageStorageStats";
import { LogOut, Package, Megaphone, Grid3X3, Home, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out successfully");
    }
    setIsSigningOut(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ImageStorageStats />
          </div>

          {/* Main */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="grid w-full max-w-3xl grid-cols-4">
                <TabsTrigger value="products" className="gap-2">
                  <Package className="w-4 h-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="categories" className="gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="offers" className="gap-2">
                  <Megaphone className="w-4 h-4" />
                  Offers
                </TabsTrigger>
                <TabsTrigger value="blogs" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Blog
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <ProductsManager />
              </TabsContent>

              <TabsContent value="categories">
                <CategoriesManager />
              </TabsContent>

              <TabsContent value="offers">
                <OffersManager />
              </TabsContent>

              <TabsContent value="blogs">
                <BlogsManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
