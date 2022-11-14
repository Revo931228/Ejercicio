using System;
using System.Collections.Generic;
using System.Text;

namespace Entity
{
    public class RecibosEntity
    {
        public int IdRecibo { get; set; }
        public int IdProveedor { get; set; }
        public int IdMoneda { get; set; }
        public int IdUsuario { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
        public string StrFecha { get; set; }
        public string Comentario { get; set; }
        public string NombreProveedor { get; set; }
        public string NombreMoneda { get; set; }
        public string NombreUsuario { get; set; }
        
    }
}
