import React from "react";
import { Card } from "./Card";

const FactCardSimpleContent = ({ data }) => {
  const content = data.facts.map(f => (
    <tr>
      <th>{f.label}</th>
      <td>
        {f.value.url ? (
          <a href={f.value.url}>{f.value.label}</a>
        ) : (
          f.value.label
        )}
      </td>
    </tr>
  ));
  return (
    <table>
      <tbody>{content}</tbody>
    </table>
  );
};

export const FactCard = ({ data }) => {
  let content = null;
  if (data.cardType === "simple") {
    console.log("In simple");

    content = <FactCardSimpleContent data={data} />;
  } else if (data.type === "avatar") {
    content = <FactCardAvatarContent data={data} />;
  } else if (data.type === "nested") {
    content = <FactCardNestedContent data={data} />;
  }

  return <Card title={data.title}>{content}</Card>;
};

