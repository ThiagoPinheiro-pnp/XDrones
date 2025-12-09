using System.Text.RegularExpressions;

public class ValidationService
{
    public bool IsValidEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        try
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    public (bool Success, string? Error) ValidatePassword(string? password)
    {
        if (string.IsNullOrEmpty(password))
            return (false, "Senha é obrigatória.");

        if (password.Length < 8)
            return (false, "Senha deve ter ao menos 8 caracteres.");

        if (!Regex.IsMatch(password, "[A-Z]"))
            return (false, "Senha deve conter ao menos uma letra maiúscula.");

        if (!Regex.IsMatch(password, "[a-z]"))
            return (false, "Senha deve conter ao menos uma letra minúscula.");

        if (!Regex.IsMatch(password, "[0-9]"))
            return (false, "Senha deve conter ao menos um dígito.");

        if (!Regex.IsMatch(password, "[!@#$%^&*(),.?\":{}|<>\\[\\]\\/;'`~_-]"))
            return (false, "Senha deve conter ao menos um caractere especial.");

        return (true, null);
    }

    // Validação de CPF usando algoritmo de dígito verificador
    public bool IsValidCPF(string? cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return false;

        // Remove caracteres especiais
        cpf = Regex.Replace(cpf, "[^0-9]", "");

        // Verifica se tem exatamente 11 dígitos
        if (cpf.Length != 11)
            return false;

        // Rejeita sequências repetidas (00000000000, 11111111111, etc)
        if (Regex.IsMatch(cpf, @"^(\d)\1{10}$"))
            return false;

        // Calcula o primeiro dígito verificador
        int sum = 0;
        for (int i = 0; i < 9; i++)
        {
            sum += int.Parse(cpf[i].ToString()) * (10 - i);
        }
        int remainder = (sum * 10) % 11;
        if (remainder == 10 || remainder == 11)
            remainder = 0;
        if (remainder != int.Parse(cpf[9].ToString()))
            return false;

        // Calcula o segundo dígito verificador
        sum = 0;
        for (int i = 0; i < 10; i++)
        {
            sum += int.Parse(cpf[i].ToString()) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder == 10 || remainder == 11)
            remainder = 0;
        if (remainder != int.Parse(cpf[10].ToString()))
            return false;

        return true;
    }
}