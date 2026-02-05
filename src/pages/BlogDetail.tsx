import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useBlog, useBlogs } from "@/hooks/useBlogs";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: blogs = [] } = useBlogs();
  
  // Find blog by slug from published blogs
  const blog = blogs.find(b => b.slug === slug);
  
  // Fallback: try to fetch directly if not in list
  const { data: directBlog } = useBlog(slug || "");
  const currentBlog = blog || directBlog;

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/blogs")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="gap-2 mb-8"
          onClick={() => navigate("/blogs")}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blogs
        </Button>

        {/* Featured Image */}
        {currentBlog.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden aspect-video bg-muted">
            <img 
              src={currentBlog.featured_image} 
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentBlog.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
            {currentBlog.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{currentBlog.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(currentBlog.published_at || currentBlog.created_at).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </div>
          </div>

          {/* Tags */}
          {currentBlog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {currentBlog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert mb-12">
            <div 
              className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: currentBlog.content.replace(/\n/g, '<br/>') }}
            />
          </div>

          {/* Divider */}
          <div className="border-t pt-8 mt-12">
            <Button 
              onClick={() => navigate("/blogs")}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              View More Blog Posts
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
