import { useState } from "react";
import { useAllBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from "@/hooks/useBlogs";
import { Blog } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/ImageUploadField";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlogsManager() {
  const { data: blogs, isLoading } = useAllBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author: "",
    tags: "",
    is_published: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      author: "",
      tags: "",
      is_published: false,
    });
    setEditingBlog(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featured_image: blog.featured_image || "",
      author: blog.author,
      tags: blog.tags.join(", "),
      is_published: blog.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill in title and content");
      return;
    }

    const blogData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt,
      content: formData.content,
      featured_image: formData.featured_image || null,
      author: formData.author,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
      view_count: editingBlog?.view_count || 0,
    };

    try {
      if (editingBlog) {
        await updateBlog.mutateAsync({ id: editingBlog.id, ...blogData });
        toast.success("Blog updated!");
      } else {
        await createBlog.mutateAsync(blogData);
        toast.success("Blog created!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete blog "${title}"?`)) return;

    try {
      await deleteBlog.mutateAsync(id);
      toast.success("Blog deleted!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      await updateBlog.mutateAsync({
        id: blog.id,
        is_published: !blog.is_published,
        published_at: !blog.is_published ? new Date().toISOString() : null,
      });
      toast.success(
        `Blog ${!blog.is_published ? "published" : "unpublished"}!`
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Blog Posts</h2>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-sm">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">Post Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g., 10 Ways to Organize Your Cabinet"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL-friendly)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="auto-generated from title"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from title. Edit to customize URL.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-sm">Content</h3>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt (Short Summary) *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="A brief summary shown on the blog listing page (100-150 characters)"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Full Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your full blog post content here..."
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use markdown formatting for better styling.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="e.g., furniture, design, tips, home-decor"
                  />
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-sm">Featured Image</h3>
                <ImageUploadField
                  value={formData.featured_image}
                  onChange={(value) =>
                    setFormData({ ...formData, featured_image: value })
                  }
                  disabled={createBlog.isPending || updateBlog.isPending}
                />
                {formData.featured_image && (
                  <div className="mt-4">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Publishing Options */}
              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label htmlFor="is_published" className="font-semibold">
                  Publish This Post
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createBlog.isPending || updateBlog.isPending}
                >
                  {editingBlog ? "Update" : "Create"} Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {blogs?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No blog posts yet. Create your first post!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {blogs?.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="p-4">
                <div className="flex gap-4 items-start">
                  {blog.featured_image && (
                    <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold truncate">{blog.title}</h3>
                      <div className="flex gap-1 flex-shrink-0">
                        {blog.is_published ? (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                      <span>By {blog.author || "Unknown"}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.view_count} views
                      </span>
                    </div>

                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleTogglePublish(blog)}
                      title={blog.is_published ? "Unpublish" : "Publish"}
                    >
                      {blog.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(blog)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(blog.id, blog.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
