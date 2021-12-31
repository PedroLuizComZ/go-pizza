import React from "react";
import { Container, Description, Image, Name, StatusContainer, StatusLabel } from "./style";
import { TouchableOpacityProps } from "react-native";
import { Order } from "@src/screens/Orders";

type Props =TouchableOpacityProps & {
  index: number;
  data: Order
}

export function OrderCard({ index, data , ...rest} : Props) {

  return (
    <Container index={index} {...rest} >
      <Image source={{uri: data.image}}  />
    <Name >{data.pizza}</Name>
      <Description>
        Mesa {data.table_number} - QTD : {data.quantity}
      </Description>

      <StatusContainer status={data.status}>
        <StatusLabel status={data.status}>
        {data.status}
        </StatusLabel>
      </StatusContainer>
    </Container>
  );
}
