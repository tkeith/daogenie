import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export function AuthedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DynamicWidget />
      <p>test</p>
      {children}
    </>
  );
}
