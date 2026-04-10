import {
  UtensilsCrossed,
  Plane,
  ShoppingBag,
  Receipt,
  HeartPulse,
  Clapperboard,
  CircleEllipsis,
} from "lucide-react";

export const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Other",
];

export const categoryIcon = {
  Food: UtensilsCrossed,
  Travel: Plane,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Health: HeartPulse,
  Entertainment: Clapperboard,
  Other: CircleEllipsis,
};

export const categoryAccent = {
  Food: "bg-amber-50 text-amber-800 ring-amber-200/60",
  Travel: "bg-sky-50 text-sky-800 ring-sky-200/60",
  Shopping: "bg-violet-50 text-violet-800 ring-violet-200/60",
  Bills: "bg-slate-100 text-slate-800 ring-slate-200/60",
  Health: "bg-rose-50 text-rose-800 ring-rose-200/60",
  Entertainment: "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200/60",
  Other: "bg-zinc-100 text-zinc-800 ring-zinc-200/60",
};
