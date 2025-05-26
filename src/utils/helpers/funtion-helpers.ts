import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { handleAxiosError } from "./handle-error-catch";

export function downloadBlob(blob: Blob | MediaSource, name = 'documento.pdf') {
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();

  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );

  document.body.removeChild(link);
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export const useQueryWithErrorHandler = <T>(
  key: any[],
  queryFn: () => Promise<T>,
  enabled = true,
  setStatusCode: Dispatch<SetStateAction<number | undefined>>,
  resource?: string
) => {
  return useQuery({
    queryKey: key,
    enabled,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (err) {
        const message = handleAxiosError({ err, setStatusCode, resource });
        toast.error(message);
        throw err;
      }
    }
  });
};