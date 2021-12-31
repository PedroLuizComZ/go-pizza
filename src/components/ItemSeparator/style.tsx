import styled from "styled-components/native";

export const Separator = styled.TouchableOpacity`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.SHAPE};
`;
