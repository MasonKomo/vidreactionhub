
import React from "react";

type ShowHeaderProps = {
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  platform: string;
};

export function ShowHeader({ title, description, thumbnail_url, platform }: ShowHeaderProps) {
  return (
    <div className="relative h-[300px] mb-8">
      {thumbnail_url && (
        <>
          <div className="absolute inset-0">
            <img
              src={thumbnail_url}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
          </div>
        </>
      )}
      <div className="absolute bottom-0 left-0 p-8">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">Watch on {platform}</p>
      </div>
    </div>
  );
}
