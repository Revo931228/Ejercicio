using Data.BDAdmon;
using Data.Enums;

namespace Data
{
    public class SPNombre
    {
        private static string TipoAccionNombre;

        public static string SubProVent;

        public string OC_UnidadNegocio;
        public string Ejecutivo;
        public string Representantes;
        public string Conceptos;
        public string TipoIndustria;
        public string Subcodigo;
        public string ClienteVentas;
        public string TipoCliente;
        public string Prospectos;
        public string TipoRemisionado;
        public string UMFacturacion;
        public string Almacen;
        public string DiasInventario;
        public string Variacion;
        public string TipoVariacion;
        public string ArticulosProspectos;
        public string Resistencias;
        public string DatosAdicionales;
        public string Clasificacion;
        public string Articulos;
        public string TipoDato;
        public string ClientesRepresentantes;
        public string UsuariosSolMultiple;
        public string TiposSolicitud;
        public string AreasSolicitud;
        public string UnidadMedida;
        public string Material;
        public string Pedido;
        public string OP;
        public string AccionesOP;
        public string CorreoAccionesOP;
        public string AutorizacionModOP;
        public string ConsultaAutorizacionOP;

        public SPNombre(SpTipo TipoAccion = SpTipo.Consulta)
        {
            TipoAccionNombre = TipoAccion == SpTipo.Actualiza ? "SPA" : "SPC";

            SubProVent = ProcesosCecso.FcaCajas + SubProcesos.FcaVentas;

            OC_UnidadNegocio = SubProVent + TablaTipo.Datos + "001" + TipoAccionNombre;
            Ejecutivo = SubProVent + "005CW" + TipoAccionNombre;
            Representantes = SubProVent + "006CW" + TipoAccionNombre;
            Conceptos = SubProVent + "007CW" + TipoAccionNombre;
            TipoIndustria = SubProVent + "008CW" + TipoAccionNombre;
            Subcodigo = SubProVent + "009CW" + TipoAccionNombre;
            ClienteVentas = SubProVent + "010CW" + TipoAccionNombre;
            TipoCliente = SubProVent + "011CW" + TipoAccionNombre;
            Prospectos = SubProVent + "012CW" + TipoAccionNombre;
            TipoRemisionado = SubProVent + "013CW" + TipoAccionNombre;
            UMFacturacion = SubProVent + "014CW" + TipoAccionNombre;
            Almacen = SubProVent + "015CW" + TipoAccionNombre;
            DiasInventario = SubProVent + "016CW" + TipoAccionNombre;
            Variacion = SubProVent + "017CW" + TipoAccionNombre;
            TipoVariacion = SubProVent + "018CW" + TipoAccionNombre;
            ArticulosProspectos = SubProVent + "019CW" + TipoAccionNombre;
            Resistencias = SubProVent + "022CW" + TipoAccionNombre;
            DatosAdicionales = SubProVent + "020CW" + TipoAccionNombre;
            Clasificacion = SubProVent + "021CW" + TipoAccionNombre;
            Articulos = SubProVent + "023CW" + TipoAccionNombre;
            TipoDato = SubProVent + "029CW" + TipoAccionNombre;
            Material = SubProVent + "030CW" + TipoAccionNombre;
            UnidadMedida = SubProVent + "031CW" + TipoAccionNombre;
            ClientesRepresentantes = SubProVent + "008MW" + TipoAccionNombre;
            UsuariosSolMultiple = SubProVent + "024CW" + TipoAccionNombre;
            TiposSolicitud = SubProVent + "025CW" + TipoAccionNombre;
            AreasSolicitud = SubProVent + "028CW" + TipoAccionNombre;
            Pedido = SubProVent + "013MW" + TipoAccionNombre + "1";
            OP = SubProVent + "023MW" + TipoAccionNombre + "1";
            AccionesOP = SubProVent + "023MW" + TipoAccionNombre + "1";
            CorreoAccionesOP = SubProVent + "023MW" + TipoAccionNombre + "2";
            AutorizacionModOP = SubProVent + "024MW" + TipoAccionNombre + "1";
            ConsultaAutorizacionOP = SubProVent + "025MW" + TipoAccionNombre + "1";
        }
    }
}

