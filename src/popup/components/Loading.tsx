import React from "react";
import { Loader } from "lucide-react"

interface LoadingProps {
  size: number
}

export const Loading: React.FC<LoadingProps> = ({ size }) => {
  return (
    <Loader size={size}>
      <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="4s"
          from="0 0 0"
          to="360 0 0"
          repeatCount="indefinite"
        ></animateTransform>
    </Loader>
  )
};
