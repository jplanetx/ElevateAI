import { Listbox } from '@headlessui/react';

type EnergyLevel = {
  name: string;
  color: string;
};

const energyLevels: EnergyLevel[] = [
  { name: 'Low', color: 'blue' },
  { name: 'Medium', color: 'yellow' },
  { name: 'High', color: 'red' },
];

type EnergySelectorProps = {
  selected: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
};

export function EnergySelector({ selected, onChange }: EnergySelectorProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      {/* Listbox implementation */}
    </Listbox>
  );
}
