import toast from 'react-hot-toast'

export function useNotification() {
  const notifySuccess = (mensaje: string) => {
    toast.success(mensaje)
  }

  const notifyError = (mensaje: string) => {
    toast.error(mensaje)
  }

  const notifyLoading = (mensaje: string) => {
    return toast.loading(mensaje)
  }

  const notifyInfo = (mensaje: string) => {
    toast(mensaje, {
      icon: 'ℹ️',
      style: {
        background: '#eff6ff',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
      },
    })
  }

  const notifyDismiss = (toastId: string) => {
    toast.dismiss(toastId)
  }

  return {
    notifySuccess,
    notifyError,
    notifyLoading,
    notifyInfo,
    notifyDismiss,
  }
}