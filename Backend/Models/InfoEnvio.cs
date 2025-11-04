namespace Backend.Models
{
public class InfoEnvio
{
public int Id { get; set; }
public string TpEnvio { get; set; } = string.Empty;
public int IdRegiaoEnvio { get; set; }
public int CdCustEnvio { get; set; }


public void AtualizarEnvio(string tipo, int regiao, int cust) {
TpEnvio = tipo; IdRegiaoEnvio = regiao; CdCustEnvio = cust;
}
}
}