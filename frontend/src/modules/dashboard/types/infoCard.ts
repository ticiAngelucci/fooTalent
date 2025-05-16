import { Contract } from "@/modules/contract/types/contract";

type CardTypes = "contract" | "property" | "contact";

interface BaseCardProps<T, Type extends CardTypes> {
  title: string;
  subtitle: string;
  type: Type;
  items: T[];
}

type ContractCardProps = BaseCardProps<Contract, "contract">;

// Cuando tengas estos modelos reales, podés tipar igual
type PropertyCardProps = BaseCardProps<any, "property">;
type ContactCardProps = BaseCardProps<any, "contact">;

export type InfoCardProps = ContractCardProps | PropertyCardProps | ContactCardProps;