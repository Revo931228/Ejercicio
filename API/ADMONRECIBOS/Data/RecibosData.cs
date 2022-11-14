using Dapper;
using Entity;
using Entity.DTO.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class RecibosData
    {
        public async Task<Result> GetUsuarios(string strConexion, int IdUsuario, string Password)
        {
            Result objResult = new Result();
            try
            {
                using (var con = new SqlConnection(strConexion))
                {
                    var result = await con.QueryMultipleAsync(
                        "ConsultaRecibos",
                        new
                        {
                            Opcion = 1,
                            Usuario = IdUsuario,
                            Password = Password
                        },
                    commandType: CommandType.StoredProcedure);
                    objResult.data = await result.ReadAsync<UsuariosEntity>();
                }
                return objResult;
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GetProveedores(string strConexion, string BusquedaProveedor)
        {
            Result objResult = new Result();
            try
            {
                using (var con = new SqlConnection(strConexion))
                {
                    var result = await con.QueryMultipleAsync(
                        "ConsultaRecibos",
                        new
                        {
                            Opcion = 2,
                            BusquedaProveedor = BusquedaProveedor
                        },
                    commandType: CommandType.StoredProcedure);
                    objResult.data = await result.ReadAsync<ProveedorEntity>();
                }
                return objResult;
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GetMonedas(string strConexion)
        {
            Result objResult = new Result();
            try
            {
                using (var con = new SqlConnection(strConexion))
                {
                    var result = await con.QueryMultipleAsync(
                        "ConsultaRecibos",
                        new
                        {
                            Opcion = 3
                        },
                    commandType: CommandType.StoredProcedure);
                    objResult.data = await result.ReadAsync<MonedaEntity>();
                }
                return objResult;
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GetRecibos(string strConexion, int IdRecibo, string Usuario)
        {
            Result objResult = new Result();
            try
            {
                using (var con = new SqlConnection(strConexion))
                {
                    var result = await con.QueryMultipleAsync(
                        "ConsultaRecibos",
                        new
                        {
                            Opcion = 4,
                            IdRecibo = IdRecibo,
                            Usuario = Usuario
                        },
                    commandType: CommandType.StoredProcedure);
                    objResult.data = await result.ReadAsync<RecibosEntity>();
                }
                return objResult;
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }

        public async Task<Result> GuardarRecibo(TokenData datosToken, RecibosEntity dts)
        {
            Result objResult = new Result();

            try
            {
                using (var con = new SqlConnection(datosToken.Conexion))
                {
                    var result = await con.QuerySingleAsync<ErrorSQL>(
                        "AdminRecibos",
                        new
                        {
                            Opcion = 1,
                            IdProveedor = dts.IdProveedor,
                            IdMoneda = dts.IdMoneda,
                            Monto = dts.Monto,
                            Fecha = dts.Fecha,
                            Comentario = dts.Comentario,
                            IdUsuario = dts.IdUsuario,
                        },
                        commandType: CommandType.StoredProcedure);
                    objResult.data = result;
                }
                return objResult;
            }
            catch (Exception ex)
            {
                objResult.Correcto = false;
                objResult.Mensaje = ex.Message;
                return objResult;
            }
        }

        public async Task<Result> ActualizarRecibo(TokenData datosToken, RecibosEntity dts)
        {
            Result objResult = new Result();

            try
            {
                using (var con = new SqlConnection(datosToken.Conexion))
                {
                    var result = await con.QuerySingleAsync<ErrorSQL>(
                        "AdminRecibos",
                        new
                        {
                            Opcion = 2,
                            IdProveedor = dts.IdProveedor,
                            IdMoneda = dts.IdMoneda,
                            Monto = dts.Monto,
                            Fecha = dts.Fecha,
                            Comentario = dts.Comentario,
                            IdUsuario = datosToken.Usuario,
                            IdRecibo = dts.IdRecibo
                        },
                        commandType: CommandType.StoredProcedure);
                    objResult.data = result;
                }
                return objResult;
            }
            catch (Exception ex)
            {
                objResult.Correcto = false;
                objResult.Mensaje = ex.Message;
                return objResult;
            }
        }

        public async Task<Result> EliminarRecibo(TokenData datosToken, RecibosEntity dts)
        {
            Result objResult = new Result();

            try
            {
                using (var con = new SqlConnection(datosToken.Conexion))
                {
                    var result = await con.QuerySingleAsync<ErrorSQL>(
                        "AdminRecibos",
                        new
                        {
                            Opcion = 3,
                            IdRecibo = dts.IdRecibo
                        },
                        commandType: CommandType.StoredProcedure);
                    objResult.data = result;
                }
                return objResult;
            }
            catch (Exception ex)
            {
                objResult.Correcto = false;
                objResult.Mensaje = ex.Message;
                return objResult;
            }
        }

    }
}
