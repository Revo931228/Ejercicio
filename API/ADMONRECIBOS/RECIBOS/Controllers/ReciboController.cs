using Business;
using Entity;
using Entity.DTO.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ADMONRECIBOS.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class ReciboController : ControllerBase
    {
        private readonly TokenData datosToken = new TokenData();

        public ReciboController(IOptions<AppSettings> AppSettings, IHttpContextAccessor httpContext)
        {
            datosToken.Conexion = httpContext.HttpContext.Items["Conexion"].ToString();
           // datosToken.Usuario = httpContext.HttpContext.Items["UsuarioERP"].ToString();
        }

        [HttpGet("GetUsuarios")]
        public async Task<IActionResult> GetUsuarios(int IdUsuario, string Password)
        {
            try
            {
                return Ok(await new RecibosBusiness().GetUsuarios(datosToken.Conexion, IdUsuario, Password));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error, {ex.Message}");
            }
        }

        [HttpGet("GetProveedores")]
        public async Task<IActionResult> GetProveedores(string BusquedaProveedor)
        {
            try
            {
                return Ok(await new RecibosBusiness().GetProveedores(datosToken.Conexion, BusquedaProveedor));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error, {ex.Message}");
            }
        }

        [HttpGet("GetMonedas")]
        public async Task<IActionResult> GetMonedas()
        {
            try
            {
                return Ok(await new RecibosBusiness().GetMonedas(datosToken.Conexion));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error, {ex.Message}");
            }
        }

        [HttpGet("GetRecibos")]
        public async Task<IActionResult> GetRecibos(int IdRecibo, string Usuario)
        {
            try
            {
                return Ok(await new RecibosBusiness().GetRecibos(datosToken.Conexion, IdRecibo, Usuario));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error, {ex.Message}");
            }
        }

        [HttpPost("GuardarRecibo")]
        public async Task<IActionResult> GuardarRecibo(RecibosEntity datos)
        {
            try
            {
                return Ok(await new RecibosBusiness().GuardarRecibo(datosToken, datos));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error, {ex.Message}");
            }
        }

        [HttpPost("ActualizarRecibo")]
        public async Task<IActionResult> ActualizarRecibo(RecibosEntity datos)
        {
            try
            {
                return Ok(await new RecibosBusiness().ActualizarRecibo(datosToken, datos));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error, {ex.Message}");
            }
        }

        [HttpPost("EliminarRecibo")]
        public async Task<IActionResult> EliminarRecibo(RecibosEntity datos)
        {
            try
            {
                return Ok(await new RecibosBusiness().EliminarRecibo(datosToken, datos));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error, {ex.Message}");
            }
        }
    }
}
