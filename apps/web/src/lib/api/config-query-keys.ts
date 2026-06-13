export const configQueryKeys = {
  all: ['config'] as const,
  colors: () => [...configQueryKeys.all, 'colors'] as const,
  list: (section: string) => [...configQueryKeys.all, section] as const,
  sizeGrids: () => [...configQueryKeys.all, 'size-grids'] as const,
};
