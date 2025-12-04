import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import { getImageDimensions } from "@sanity/asset-utils";

const PortableTextImage = ({ value, isInline }) => {
  const { width, height } = getImageDimensions(value);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urlFor(value).format("webp").url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        display: isInline ? "inline-block" : "block",
        aspectRatio: width / height,
      }}
    />
  );
};

const components = {
  types: {
    image: PortableTextImage,
  },
};

export const FAQPortableText = ({ body }) => {
  return <PortableText value={body} components={components} />;
};
