import React from "react";
import { Image, ImagePlaceholder, PlaceholderTitle } from "./style";

type Props = {
  uri?: string | null;
};

export function Photo({ uri }: Props) {
  if (uri) {
    return <Image source={{ uri }} />;
  }

  return (
    <ImagePlaceholder>
      <PlaceholderTitle>Nenhuma Foto{"\n"} Carregada</PlaceholderTitle>
    </ImagePlaceholder>
  );
}
