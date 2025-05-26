import { isAxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { ApiStatusCode } from '../enums';

type ExProps = {
  err: unknown | Error;
  setStatusCode: Dispatch<SetStateAction<number | undefined>>;
  resource?: string;
};

export const handleAxiosError = ({ err, setStatusCode, resource }: ExProps): string => {
  let message = 'Erro desconhecido. Por favor, entre em contato com o suporte técnico.';

  if (isAxiosError(err)) {
    const { response } = err;

    const error = {
      code: response?.status + ' ' + response?.statusText,
      message: response?.data?.message || response?.data?.detail || message
    };

    switch (response?.status) {
      case ApiStatusCode.BadRequest:
        message = `${error.code} - Ops! Algo deu errado. Por favor, tente novamente.`;
        setStatusCode(response.status);
        break;
      case ApiStatusCode.Unauthorized:
        message = `${error.code} - Acesso não autorizado. Por favor, realize a autenticação novamente.`;
        setStatusCode(response.status);
        break;
      case ApiStatusCode.Forbidden:
        message = `${error.code} - Usuário não tem permissão para acessar este recurso`;
        setStatusCode(response.status);
        break;
      case ApiStatusCode.NotFound:
        message = `${error.code} - ${response?.data?.detail ?? 'Recurso não encontrado'}`;
        setStatusCode(response.status);
        break;
      case ApiStatusCode.InternalServerError:
        message = `${error.code} - Erro interno do servidor`;
        setStatusCode(response.status);
        break;
      default:
        message = `${500} - Ops! Ocorreru um erro interno do servidor ao acessar ${resource}!`;
        setStatusCode(response?.status ?? 500);
        break;
    }
  }

  return message;
};
