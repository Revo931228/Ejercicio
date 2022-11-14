using Data;
using Entity;
using Entity.DTO.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class RecibosBusiness
    {
        public async Task<Result> GetUsuarios(string strConexion, int IdUsuario, string Password)
        {
            try
            {
                return await new RecibosData().GetUsuarios(strConexion, IdUsuario, Password);
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GetProveedores(string strConexion, string BusquedaProveedor)
        {
            try
            {
                return await new RecibosData().GetProveedores(strConexion, BusquedaProveedor);
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GetMonedas(string strConexion)
        {
            try
            {
                return await new RecibosData().GetMonedas(strConexion);
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GetRecibos(string strConexion, int IdRecibo, string Usuario)
        {
            try
            {
                return await new RecibosData().GetRecibos(strConexion, IdRecibo, Usuario);
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GuardarRecibo(TokenData datosToken, RecibosEntity dts)
        {
            try
            {
                return await new RecibosData().GuardarRecibo(datosToken, dts);
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> ActualizarRecibo(TokenData datosToken, RecibosEntity dts)
        {
            try
            {
                return await new RecibosData().ActualizarRecibo(datosToken, dts);
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> EliminarRecibo(TokenData datosToken, RecibosEntity dts)
        {
            try
            {
                return await new RecibosData().EliminarRecibo(datosToken, dts);
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

    }
}
