"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/5">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${title} image ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/5 transition",
                index === activeIndex
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
