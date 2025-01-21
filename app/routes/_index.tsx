import type { MetaFunction } from "@remix-run/node";
import BreathingExercises from "../components/breathing-exercises";

export const meta: MetaFunction = () => {
  return [
    { title: "Breathing Exercises" },
    { name: "description", content: "A mindful breathing exercise application" },
  ];
};




export default function Index() {
  return <BreathingExercises />;
}