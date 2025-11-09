import { createClient } from "@sanity/client";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "38uy7m8l";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const token = import.meta.env.VITE_SANITY_WRITE_TOKEN;

// Admin client with write permissions
export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion: "2023-10-01",
  useCdn: false, // Don't use CDN for writes
  token, // Write token from environment variable
});

// Check if admin client is properly configured
export const isAdminConfigured = !!token;

// Project operations
export const projectOperations = {
  // Create a new project
  async create(project: {
    title: string;
    category: string;
    description?: string;
    image?: File;
  }) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    let imageAsset;
    if (project.image) {
      // Upload image to Sanity
      imageAsset = await adminClient.assets.upload("image", project.image, {
        contentType: project.image.type,
        filename: project.image.name,
      });
    }

    // Create the document
    const document = {
      _type: "project",
      title: project.title,
      category: project.category,
      description: project.description || "",
      published: true, // Default to published
      image: imageAsset
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          }
        : undefined,
    };

    return await adminClient.create(document);
  },


  // Delete a project
  async delete(id: string) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    return await adminClient.delete(id);
  },

  // Get all projects (for admin dashboard)
  async getAll(includeDrafts = true) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    const filter = includeDrafts ? `*[_type == "project"]` : `*[_type == "project" && published == true]`;

    return await adminClient.fetch(
      `${filter} | order(order asc, _createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        title,
        category,
        description,
        published,
        order,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions
            }
          }
        }
      }`
    );
  },

  // Get a single project by ID
  async getById(id: string) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    return await adminClient.fetch(
      `*[_type == "project" && _id == $id][0] {
        _id,
        _createdAt,
        _updatedAt,
        title,
        category,
        description,
        published,
        order,
        image {
          asset-> {
            _id,
            url,
            metadata {
              dimensions
            }
          }
        }
      }`,
      { id }
    );
  },

  // Bulk operations
  async bulkDelete(ids: string[]) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    const transaction = adminClient.transaction();
    ids.forEach((id) => transaction.delete(id));
    return await transaction.commit();
  },

  async bulkPublish(ids: string[], published: boolean) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    const transaction = adminClient.transaction();
    ids.forEach((id) => {
      transaction.patch(id, { set: { published } });
    });
    return await transaction.commit();
  },

  async bulkUpdateOrder(updates: { id: string; order: number }[]) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    const transaction = adminClient.transaction();
    updates.forEach(({ id, order }) => {
      transaction.patch(id, { set: { order } });
    });
    return await transaction.commit();
  },

  // Update project with publish status and order
  async update(
    id: string,
    updates: {
      title?: string;
      category?: string;
      description?: string;
      image?: File;
      published?: boolean;
      order?: number;
    }
  ) {
    if (!isAdminConfigured) {
      throw new Error("Admin client not configured. Please set VITE_SANITY_WRITE_TOKEN");
    }

    const patch: Record<string, unknown> = {};

    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.category !== undefined) patch.category = updates.category;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.published !== undefined) patch.published = updates.published;
    if (updates.order !== undefined) patch.order = updates.order;

    // Handle image upload if provided
    if (updates.image) {
      const imageAsset = await adminClient.assets.upload("image", updates.image, {
        contentType: updates.image.type,
        filename: updates.image.name,
      });

      patch.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }

    return await adminClient.patch(id).set(patch).commit();
  },
};

