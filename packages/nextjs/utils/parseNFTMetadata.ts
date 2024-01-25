/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { z } from "zod";

// Define the categories as a literal union
const categorySchema = z.union([z.literal("Resource"), z.literal("Craftable")]);

// Define a schema for the "Item Type" trait
const itemTypeSchema = z.object({
  trait_type: z.literal("Item Type"),
  value: categorySchema,
});

export type ItemTypeTrait = z.infer<typeof itemTypeSchema>;

// Define a schema for the "Cost" trait, applicable for "Craftable Item" only
const costTraitSchema = z.object({
  trait_type: z.literal("Cost"),
  value: z.string(),
});

const rarityTraitSchema = z.object({
  trait_type: z.literal("Rarity"),
  value: z.string(),
});

export type RarityTrait = z.infer<typeof rarityTraitSchema>;

// Define a schema for traits (including "Item Type", "Cost", and potentially others)
const traitSchema = z.union([itemTypeSchema, costTraitSchema, rarityTraitSchema]);

export type ItemTrait = z.infer<typeof traitSchema>;

// Define a schema for the NFT metadata
const nftMetadataSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    image: z.string(),
    attributes: z.array(traitSchema),
  })
  .superRefine((data, ctx) => {
    const itemTypeTrait = data.attributes.find((attr): attr is ItemTypeTrait => attr.trait_type === "Item Type");
    const costTrait = data.attributes.find(attr => attr.trait_type === "Cost");
    const rarityTrait = data.attributes.find((attr): attr is RarityTrait => attr.trait_type === "Rarity");

    if (!rarityTrait) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `"Rarity" trait is required.`,
      });
    }

    if (!itemTypeSchema) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `"Item Type" trait is required.`,
      });
    }

    if (itemTypeTrait && itemTypeTrait.value === "Craftable" && !costTrait) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `For "Craftable Item" category, the "Cost" trait is required.`,
      });
    }
  })
  .transform(data => {
    const itemTypeTrait = data.attributes.find((attr): attr is ItemTypeTrait => attr.trait_type === "Item Type");
    const costTrait = data.attributes.find(attr => attr.trait_type === "Cost");
    const rarityTrait = data.attributes.find((attr): attr is RarityTrait => attr.trait_type === "Rarity");

    return {
      ...data,
      category: itemTypeTrait!.value,
      cost: costTrait?.value,
      rarity: rarityTrait!.value,
    };
  });

export type NFTMetadata = z.infer<typeof nftMetadataSchema>;

const parseMetadata = (json: unknown) => nftMetadataSchema.parse(json);

export default parseMetadata;
