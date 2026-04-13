import { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ImagePlus, GripVertical, Package, Upload } from 'lucide-react';
import { useIdols, useCreateIdol, useUpdateIdol, useDeleteIdol } from '@/hooks/useIdols';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Idol } from '@/types/idol';
import { BASE_URL } from '@/lib/apiClient';

const EMPTY_FORM = {
  name: '', category_id: '1', material: '', dimensions: '', price: '', sale_price: '',
  description: '', featured: false, newImages: [] as File[], existingImages: [] as any[],
};

const AdminIdolsPage = () => {
  const { data: idols = [], isLoading } = useIdols();
  const createMutation = useCreateIdol();
  const updateMutation = useUpdateIdol();
  const deleteMutation = useDeleteIdol();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);

  const openNew = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (idol: Idol) => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setForm({
      name: idol.name,
      category_id: idol.category_id?.toString() || '1',
      material: idol.material || '',
      dimensions: idol.dimensions || idol.weight?.toString() || '',
      price: idol.price.toString(),
      sale_price: idol.sale_price?.toString() || '',
      description: idol.description || '',
      featured: idol.is_featured,
      newImages: [],
      existingImages: idol.images ? [...idol.images] : [],
    });
    setEditingId(idol.id);
    setShowForm(true);
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map((f) => URL.createObjectURL(f));
      setForm((f) => ({ ...f, newImages: [...f.newImages, ...filesArray] }));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeNewImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setForm((f) => ({
      ...f,
      newImages: f.newImages.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index: number) => {
    setForm((f) => ({
      ...f,
      existingImages: f.existingImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Please fill name and price');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    if (form.sale_price) formData.append('sale_price', form.sale_price);
    formData.append('category_id', form.category_id);
    if (form.material) formData.append('material', form.material);
    if (form.dimensions) formData.append('dimensions', form.dimensions);
    if (form.description) formData.append('description', form.description);
    formData.append('is_featured', form.featured ? 'true' : 'false');
    
    // Append files
    form.newImages.forEach((file) => {
      formData.append('images', file);
    });

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          toast.success('Idol updated successfully');
          setShowForm(false);
        },
        onError: () => toast.error('Failed to update idol')
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('Idol added successfully');
          setShowForm(false);
        },
        onError: () => toast.error('Failed to add idol')
      });
    }
  };

  const handleDelete = (id: string | number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
        toast.success('Idol deleted');
      },
      onError: () => toast.error('Failed to delete idol')
    });
  };

  if (isLoading) {
      return <div className="p-8 text-center bg-card rounded-xl">Loading idols...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Manage Idols</h1>
          <p className="text-muted-foreground mt-1">{idols.length} idol{idols.length !== 1 ? 's' : ''} in catalog</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-gold text-secondary font-semibold rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 h-11 px-6">
          <Plus className="w-4 h-4 mr-2" /> Add New Idol
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-8 pb-8 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-2xl shadow-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">{editingId ? 'Edit Idol' : 'Add New Idol'}</h3>
                <p className="text-sm text-muted-foreground mt-1">Fill in the idol details below</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Lord Ganesha Brass Idol" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category ID *</Label>
                  <Input type="number" value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} placeholder="1" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Material</Label>
                  <Input value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} placeholder="Pure Brass" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Dimensions</Label>
                  <Input value={form.dimensions} onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))} placeholder="6 inches" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Price (₹) *</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sale Price (₹)</Label>
                  <Input type="number" value={form.sale_price} onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value }))} className="h-11" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 text-sm text-foreground cursor-pointer bg-muted/50 px-4 py-3 rounded-xl border border-border w-full">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="rounded accent-primary w-4 h-4" />
                    Featured on homepage
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the idol..." />
              </div>

              {/* Multi-image section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Product Images *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-lg text-xs gap-1.5 focus:ring-2 focus:ring-primary">
                    <ImagePlus className="w-3.5 h-3.5" /> Select files from system
                  </Button>
                  <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {form.existingImages.map((img, i) => {
                    const normalizedUrl = img.image_url.replace(/\\\\/g, '/');
                    return (
                    <div key={`existing-${i}`} className="relative border border-border rounded-lg overflow-hidden h-24">
                      <img src={normalizedUrl.startsWith('http') ? normalizedUrl : `${BASE_URL}/${normalizedUrl}`} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )})}
                  {form.newImages.map((file, i) => (
                    <div key={`new-${i}`} className="relative border-2 border-primary/40 rounded-lg overflow-hidden h-24 group">
                      {previewUrls[i] ? (
                        <img
                          src={previewUrls[i]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                          <Upload className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.name}
                      </div>
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-1 rounded-full hover:bg-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="bg-gradient-gold text-secondary font-semibold rounded-xl hover:opacity-90 h-11 px-8">
                  {editingId ? (updateMutation.isPending ? 'Updating...' : 'Update Idol') : (createMutation.isPending ? 'Adding...' : 'Add Idol')}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl h-11">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Idol Grid */}
      {idols.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">No idols added yet</p>
          <p className="text-muted-foreground text-sm mt-1">Click "Add New Idol" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {idols.map((idol) => (
            <div key={idol.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
              {/* Image strip */}
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                {idol.images && idol.images.length > 0 ? (() => {
                  const firstImgUrl = idol.images[0].image_url.replace(/\\\\/g, '/');
                  return (
                  <div className="flex h-full">
                    <img src={firstImgUrl.startsWith('http') ? firstImgUrl : `${BASE_URL}/${firstImgUrl}`} alt="" className="w-2/3 h-full object-cover" />
                    {idol.images.length > 1 && (
                      <div className="w-1/3 flex flex-col">
                        {idol.images.slice(1, 3).map((img, i) => {
                          const normalizedUrl = img.image_url.replace(/\\\\/g, '/');
                          return (
                          <img key={i} src={normalizedUrl.startsWith('http') ? normalizedUrl : `${BASE_URL}/${normalizedUrl}`} alt="" className="flex-1 object-cover border-l border-border" />
                        )})}
                      </div>
                    )}
                  </div>
                )})() : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/60"><Package className="w-8 h-8 opacity-20" /></div>
                )}
                {idol.is_featured && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    Featured
                  </span>
                )}
                {idol.images && idol.images.length > 0 && (
                  <span className="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-[10px] font-medium text-foreground px-2 py-1 rounded-full shadow-sm">
                    {idol.images.length} image{idol.images.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground truncate">{idol.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{idol.category?.name || 'Category'} · {idol.material} · {idol.dimensions || idol.weight}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-foreground">₹{Number(idol.price).toLocaleString()}</span>
                  {idol.sale_price && (
                    <span className="text-sm text-muted-foreground line-through">₹{Number(idol.sale_price).toLocaleString()}</span>
                  )}
                  <span className="text-xs text-primary font-medium ml-auto">★ {Number(idol.rating_avg || 0).toFixed(1)}</span>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button size="sm" variant="outline" onClick={() => openEdit(idol)} className="flex-1 rounded-lg gap-1.5 text-xs h-9">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  {deleteConfirm === idol.id ? (
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(idol.id)} disabled={deleteMutation.isPending} className="rounded-lg text-xs h-9">
                        {deleteMutation.isPending ? '...' : 'Confirm'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)} className="rounded-lg text-xs h-9">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(idol.id)} className="rounded-lg text-xs h-9 text-destructive border-destructive/30 hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminIdolsPage;
