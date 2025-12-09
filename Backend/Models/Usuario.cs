namespace Backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty; // Em produção, usaríamos Hash!
        public string Role { get; set; } = "Cliente"; // "Admin" ou "Cliente"
        // Campos opcionais de endereço (preenchidos no cadastro)
        public string Endereco { get; set; } = string.Empty;
        public string Numero { get; set; } = string.Empty;
        public string Cep { get; set; } = string.Empty;
        public string Referencia { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
    }
}