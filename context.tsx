import React, { FC, ComponentProps } from "react";
import { HallConextProvider } from "./app/hall/context";
import { ProfileContextProvider } from "./app/profile/context";
import { HomeContextProvider } from "./app/home/context";

export const combineContext = (...components: FC[]): FC<any> => {
  const CombinedComponent = components.reduce(
    (AccumulatedComponents: any, CurrentComponent: any) => {
      const WrapperComponent: FC<any> = ({
        children,
      }: ComponentProps<FC<any>>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };

      // Assign a displayName to the WrapperComponent
      WrapperComponent.displayName = `Combined(${
        CurrentComponent.displayName || CurrentComponent.name || "Unknown"
      })`;

      return WrapperComponent;
    },
    ({ children }: any) => <>{children}</>
  );

  return CombinedComponent;
};

const providers = [
  HallConextProvider,
  ProfileContextProvider,
  HomeContextProvider,
] as any;
export const AppContextProvider = combineContext(...providers);
