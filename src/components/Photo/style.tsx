import theme from "@src/theme";
import styled, { css } from "styled-components/native";

export const Image = styled.Image`
  height: 160px;
  width: 160px;
  border-radius: 80px;
`;

export const ImagePlaceholder = styled.View`
  height: 160px;
  width: 160px;
  border-radius: 80px;
  justify-content: center;
  align-items: center;

  border: 1px dotted ${({ theme }) => theme.COLORS.SECONDARY_900};
`;

export const PlaceholderTitle = styled.Text`
  font-size: 14px;
  text-align: center;

  ${({ theme }) => css`
  font-family : ${theme.FONTS.TEXT}
  color : ${theme.COLORS.SECONDARY_900}
  `}
`;
