import { getHelloWorld } from './get-hello-world';

export function ReturnsCorrectValue() {
  return <div>{getHelloWorld()}</div>;
}
