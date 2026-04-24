import {
  Modal as HeroModal,
  type ModalBackdropProps as HeroModalBackdropProps,
  type UseOverlayStateReturn,
} from "@heroui/react";

export interface AppModalProps extends HeroModalBackdropProps {
  state: UseOverlayStateReturn;
}

export const AppModal = ({ state, children, ...props }: AppModalProps) => {
  return (
    <HeroModal.Backdrop
      {...props}
      isOpen={state.isOpen}
      onOpenChange={state.setOpen}
    >
      <HeroModal.Container>{children}</HeroModal.Container>
    </HeroModal.Backdrop>
  );
};
